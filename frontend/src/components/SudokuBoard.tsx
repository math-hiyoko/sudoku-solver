import React from 'react'
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

  const handleCellChange = (row: number, col: number, value: string) => {
    if (!onChange) return

    const numValue = value === '' ? null : parseInt(value)
    if (numValue && (numValue < 1 || numValue > boardSize)) return

    onChange(row, col, numValue)
  }

  const getCellStyle = (row: number, col: number) => {
    const isInvalid = invalidCells.some(cell => cell.row === row && cell.column === col)
    const isNewValue = originalBoard && !isInput &&
      (originalBoard[row][col] === null || originalBoard[row][col] === undefined || isNaN(originalBoard[row][col])) &&
      board[row][col] !== null

    const baseStyle = {
      width: '40px',
      height: '40px',
      border: '1px solid #ccc',
      fontSize: '16px',
      backgroundColor: isInvalid ? '#ffe6e6' : (isInput ? '#fff' : '#f9f9f9'),
      // 入力フィールドの場合はtextAlign、表示用divの場合はflexレイアウトを使用
      ...(isInput ? {
        textAlign: 'center' as const,
        boxSizing: 'border-box' as const,
      } : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }),
    }

    const borderStyle = {
      ...baseStyle,
      borderRight: (col + 1) % SUDOKU_LEVEL === 0 ? '3px solid #333' : (isInvalid ? '2px solid #ff4444' : baseStyle.border),
      borderBottom: (row + 1) % SUDOKU_LEVEL === 0 ? '3px solid #333' : (isInvalid ? '2px solid #ff4444' : baseStyle.border),
      borderTop: row === 0 ? '3px solid #333' : (isInvalid ? '2px solid #ff4444' : baseStyle.border),
      borderLeft: col === 0 ? '3px solid #333' : (isInvalid ? '2px solid #ff4444' : baseStyle.border),
      color: isInvalid ? '#cc0000' : (isNewValue ? '#0066cc' : '#333'),
    }

    return borderStyle
  }

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
                    type="text"
                    value={cell || ''}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
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