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

  it('highlights new values in blue when originalBoard is provided', () => {
    const partialBoard = [
      [5, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null]
    ]

    render(
      <SudokuBoard
        board={solvedBoard}
        originalBoard={partialBoard}
      />
    )

    const cells = document.querySelectorAll('.sudoku-cell')
    const firstCell = cells[0] as HTMLElement
    const secondCell = cells[1] as HTMLElement

    // First cell (5) was in original, should be black
    expect(firstCell.style.color).toBe('rgb(51, 51, 51)')
    // Second cell (3) was not in original, should be blue
    expect(secondCell.style.color).toBe('rgb(0, 102, 204)')
  })

  it('applies invalid cell styling correctly', () => {
    const invalidCells = [{ row: 0, column: 1 }]

    render(
      <SudokuBoard
        board={solvedBoard}
        invalidCells={invalidCells}
      />
    )

    const cells = document.querySelectorAll('.sudoku-cell')
    const invalidCell = cells[1] as HTMLElement
    const validCell = cells[0] as HTMLElement

    // Invalid cell should have red color and background
    expect(invalidCell.style.color).toBe('rgb(204, 0, 0)')
    expect(invalidCell.style.backgroundColor).toBe('rgb(255, 230, 230)')

    // Valid cell should have normal styling
    expect(validCell.style.color).toBe('rgb(51, 51, 51)')
    expect(validCell.style.backgroundColor).toBe('rgb(249, 249, 249)')
  })

  it('treats NaN values in originalBoard as new values for blue highlighting', () => {
    const boardWithNaN: (number | null)[][] = [
      [5, NaN, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null]
    ]

    render(
      <SudokuBoard
        board={solvedBoard}
        originalBoard={boardWithNaN}
      />
    )

    const cells = document.querySelectorAll('.sudoku-cell')
    const firstCell = cells[0] as HTMLElement
    const secondCell = cells[1] as HTMLElement

    // First cell (5) was in original, should be black
    expect(firstCell.style.color).toBe('rgb(51, 51, 51)')
    // Second cell (3) had NaN in original, should be blue (treated as new value)
    expect(secondCell.style.color).toBe('rgb(0, 102, 204)')
  })

  describe('Keyboard Navigation', () => {
    it('moves focus to the right cell when ArrowRight is pressed', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus()

      fireEvent.keyDown(inputs[0], { key: 'ArrowRight' })

      expect(document.activeElement).toBe(inputs[1])
    })

    it('moves focus to the left cell when ArrowLeft is pressed', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[1].focus()

      fireEvent.keyDown(inputs[1], { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(inputs[0])
    })

    it('moves focus to the cell below when ArrowDown is pressed', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus()

      fireEvent.keyDown(inputs[0], { key: 'ArrowDown' })

      expect(document.activeElement).toBe(inputs[9]) // Next row, same column
    })

    it('moves focus to the cell above when ArrowUp is pressed', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[9].focus() // Second row, first column

      fireEvent.keyDown(inputs[9], { key: 'ArrowUp' })

      expect(document.activeElement).toBe(inputs[0]) // First row, first column
    })

    it('does not move beyond the left boundary', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus() // Already at leftmost position

      fireEvent.keyDown(inputs[0], { key: 'ArrowLeft' })

      expect(document.activeElement).toBe(inputs[0]) // Should stay at same position
    })

    it('does not move beyond the right boundary', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[8].focus() // Rightmost position of first row

      fireEvent.keyDown(inputs[8], { key: 'ArrowRight' })

      expect(document.activeElement).toBe(inputs[8]) // Should stay at same position
    })

    it('does not move beyond the top boundary', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[0].focus() // Already at topmost position

      fireEvent.keyDown(inputs[0], { key: 'ArrowUp' })

      expect(document.activeElement).toBe(inputs[0]) // Should stay at same position
    })

    it('does not move beyond the bottom boundary', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      inputs[80].focus() // Bottom-right position

      fireEvent.keyDown(inputs[80], { key: 'ArrowDown' })

      expect(document.activeElement).toBe(inputs[80]) // Should stay at same position
    })

    it('does not handle keyboard navigation when not in input mode', () => {
      render(<SudokuBoard board={emptyBoard} isInput={false} />)

      const cells = document.querySelectorAll('.sudoku-cell')
      const firstCell = cells[0] as HTMLElement

      // Should not respond to keyboard events in display mode
      fireEvent.keyDown(firstCell, { key: 'ArrowRight' })
      // No assertion needed - just ensuring no errors occur
    })

    it('highlights focused cell with different background color', () => {
      const mockOnChange = jest.fn()
      render(
        <SudokuBoard
          board={emptyBoard}
          isInput={true}
          onChange={mockOnChange}
        />
      )

      const inputs = screen.getAllByRole('textbox')
      fireEvent.focus(inputs[0])

      const focusedCell = inputs[0] as HTMLInputElement
      expect(focusedCell.style.backgroundColor).toBe('rgb(230, 243, 255)')
    })
  })
})