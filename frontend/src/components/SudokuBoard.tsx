import React, { useState, useRef, useCallback, useEffect } from 'react'
import { SudokuBoard as SudokuBoardType } from '../types/sudoku'

interface SudokuBoardProps {
  board: SudokuBoardType
  title?: string
  isInput?: boolean
  onChange?: (row: number, col: number, value: number | null) => void
  invalidCells?: { row: number; column: number }[]
  originalBoard?: SudokuBoardType
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  title,
  isInput = false,
  onChange,
  invalidCells = [],
  originalBoard
}) => {
  const SUDOKU_LEVEL = parseInt(process.env.GATSBY_SUDOKU_LEVEL || '3')
  const boardSize = SUDOKU_LEVEL * SUDOKU_LEVEL

  const BASE_BORDER = '1px solid #ccc'
  const THICK_BORDER = '3px solid #333'
  const ERROR_BORDER = '2px solid #ff4444'

  const [cellSize, setCellSize] = useState(44)
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[][]>(
    Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
  )

  useEffect(() => {
    const updateCellSize = () => {
      if (typeof window === 'undefined') return

      const screenWidth = window.innerWidth
      const padding = 40
      const maxBoardWidth = screenWidth - padding
      const calculatedCellSize = Math.floor(maxBoardWidth / boardSize)

      const minCellSize = 32
      const maxCellSize = 44
      const newCellSize = Math.max(minCellSize, Math.min(maxCellSize, calculatedCellSize))

      setCellSize(newCellSize)
    }

    updateCellSize()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateCellSize)
      return () => window.removeEventListener('resize', updateCellSize)
    }
  }, [boardSize])

  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    if (!onChange) return

    if (value === '') {
      onChange(row, col, null)
      return
    }

    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 1 || numValue > boardSize) return

    onChange(row, col, numValue)
  }, [onChange, boardSize])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    if (!isInput) return

    let newRow = row
    let newCol = col

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        newRow = Math.max(0, row - 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        newRow = Math.min(boardSize - 1, row + 1)
        break
      case 'ArrowLeft':
        e.preventDefault()
        newCol = Math.max(0, col - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        newCol = Math.min(boardSize - 1, col + 1)
        break
      default:
        return
    }

    setFocusedCell({ row: newRow, col: newCol })
    const targetInput = inputRefs.current[newRow][newCol]
    if (targetInput) {
      targetInput.focus()
    }
  }, [isInput, boardSize])

  const getCellStyle = useCallback((row: number, col: number) => {
    const isInvalid = invalidCells.some(cell => cell.row === row && cell.column === col)
    const isNewValue = originalBoard && !isInput &&
      (originalBoard[row][col] === null || originalBoard[row][col] === undefined || isNaN(originalBoard[row][col])) &&
      board[row][col] !== null
    const isFocused = focusedCell && focusedCell.row === row && focusedCell.col === col

    const getBackgroundColor = () => {
      if (isInvalid) return '#ffe6e6'
      if (isFocused && isInput) return '#e6f3ff'
      if (isInput) return '#fff'
      return '#f9f9f9'
    }

    const getBorder = (isEdge: boolean, isBlockEdge: boolean) => {
      if (isEdge) return THICK_BORDER
      if (isInvalid) return ERROR_BORDER
      if (isBlockEdge) return THICK_BORDER
      return BASE_BORDER
    }

    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      border: BASE_BORDER,
      fontSize: cellSize >= 40 ? '18px' : '16px',
      fontWeight: '700',
      backgroundColor: getBackgroundColor(),
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)',
      touchAction: 'manipulation',
      ...(isInput ? {
        textAlign: 'center' as const,
        boxSizing: 'border-box' as const,
        WebkitAppearance: 'none' as const,
        MozAppearance: 'textfield' as const,
      } : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none' as const,
      }),
      borderRight: getBorder(false, (col + 1) % SUDOKU_LEVEL === 0),
      borderBottom: getBorder(false, (row + 1) % SUDOKU_LEVEL === 0),
      borderTop: getBorder(row === 0, false),
      borderLeft: getBorder(col === 0, false),
      color: isInvalid ? '#cc0000' : (isNewValue ? '#007bff' : '#333'),
    }
  }, [invalidCells, originalBoard, isInput, board, focusedCell, SUDOKU_LEVEL, cellSize])

  return (
    <div style={{ margin: '20px 0' }}>
      {title && <h3 style={{ marginBottom: '10px' }}>{title}</h3>}
      <div style={{ display: 'inline-block' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div key={colIndex}>
                {isInput ? (
                  <input
                    ref={(el) => (inputRefs.current[rowIndex][colIndex] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[1-9]"
                    value={cell || ''}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                    onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                    style={getCellStyle(rowIndex, colIndex)}
                    className="sudoku-cell"
                    maxLength={1}
                  />
                ) : (
                  <div style={getCellStyle(rowIndex, colIndex)} className="sudoku-cell">
                    {cell || ''}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SudokuBoard