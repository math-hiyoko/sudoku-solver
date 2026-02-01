import React, { useState, useRef, useCallback, useEffect } from 'react'
import { SudokuBoard as SudokuBoardType } from '../types/sudoku'
import { config, boardSize } from '../config'

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
  originalBoard,
}) => {
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

      const isNarrowScreen = screenWidth < 768
      const minCellSize = isNarrowScreen ? 36 : 32
      const maxCellSize = isNarrowScreen ? 52 : 44
      setCellSize(Math.max(minCellSize, Math.min(maxCellSize, calculatedCellSize)))
    }

    updateCellSize()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateCellSize)
      return () => window.removeEventListener('resize', updateCellSize)
    }
  }, [])

  const handleCellChange = useCallback((row: number, col: number, value: string) => {
    if (!onChange) return
    if (value === '') {
      onChange(row, col, null)
      return
    }
    const numValue = parseInt(value)
    if (isNaN(numValue) || numValue < 1 || numValue > boardSize) return
    onChange(row, col, numValue)
  }, [onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, row: number, col: number) => {
    if (!isInput) return

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      onChange?.(row, col, null)
      return
    }

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
    inputRefs.current[newRow][newCol]?.focus()
  }, [isInput, onChange])

  const isInvalidCell = useCallback((row: number, col: number) => {
    return invalidCells.some(cell => cell.row === row && cell.column === col)
  }, [invalidCells])

  const isNewValue = useCallback((row: number, col: number) => {
    if (!originalBoard || isInput) return false
    const origValue = originalBoard[row][col]
    return (origValue === null || origValue === undefined || isNaN(origValue)) && board[row][col] !== null
  }, [originalBoard, isInput, board])

  const getTdStyle = useCallback((row: number, col: number): React.CSSProperties => {
    const isInvalid = isInvalidCell(row, col)
    const getBorderWidth = (isBlockEdge: boolean) => isBlockEdge ? '2px' : '1px'

    return {
      padding: 0,
      borderStyle: 'solid',
      borderColor: isInvalid ? '#ff4444' : '#333',
      borderTopWidth: getBorderWidth(row % config.sudokuLevel === 0),
      borderLeftWidth: getBorderWidth(col % config.sudokuLevel === 0),
      borderRightWidth: getBorderWidth((col + 1) % config.sudokuLevel === 0 || col === boardSize - 1),
      borderBottomWidth: getBorderWidth((row + 1) % config.sudokuLevel === 0 || row === boardSize - 1),
    }
  }, [isInvalidCell])

  const getCellStyle = useCallback((row: number, col: number): React.CSSProperties => {
    const isInvalid = isInvalidCell(row, col)
    const isNew = isNewValue(row, col)
    const isFocused = focusedCell?.row === row && focusedCell?.col === col

    const getBackgroundColor = () => {
      if (isInvalid) return '#ffe6e6'
      if (isFocused && isInput) return '#e6f3ff'
      return isInput ? '#fff' : '#f9f9f9'
    }

    const baseStyle: React.CSSProperties = {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      fontSize: cellSize >= 40 ? '18px' : '16px',
      fontWeight: 700,
      backgroundColor: getBackgroundColor(),
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)',
      touchAction: 'manipulation',
      textAlign: 'center',
      boxSizing: 'border-box',
      padding: 0,
      border: 'none',
      color: isInvalid ? '#cc0000' : isNew ? '#007bff' : '#333',
    }

    if (isInput) {
      return {
        ...baseStyle,
        WebkitAppearance: 'none',
        MozAppearance: 'textfield',
      } as React.CSSProperties
    }

    return {
      ...baseStyle,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
    }
  }, [isInvalidCell, isNewValue, isInput, focusedCell, cellSize])

  return (
    <div style={{ margin: '20px 0' }}>
      {title && <h3 style={{ marginBottom: '10px' }}>{title}</h3>}
      <table style={{ borderCollapse: 'collapse', display: 'inline-block' }}>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={getTdStyle(rowIndex, colIndex)}>
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
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default SudokuBoard
