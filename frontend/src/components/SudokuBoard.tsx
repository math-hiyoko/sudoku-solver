import React from 'react'
import { SudokuBoard as SudokuBoardType } from '../types/sudoku'

interface SudokuBoardProps {
  board: SudokuBoardType
  title?: string
  isInput?: boolean
  onChange?: (row: number, col: number, value: number | null) => void
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  title,
  isInput = false,
  onChange
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
    const baseStyle = {
      width: '40px',
      height: '40px',
      border: '1px solid #ccc',
      textAlign: 'center' as const,
      fontSize: '16px',
      backgroundColor: isInput ? '#fff' : '#f9f9f9',
    }

    const borderStyle = {
      ...baseStyle,
      borderRight: (col + 1) % SUDOKU_LEVEL === 0 ? '3px solid #333' : baseStyle.border,
      borderBottom: (row + 1) % SUDOKU_LEVEL === 0 ? '3px solid #333' : baseStyle.border,
      borderTop: row === 0 ? '3px solid #333' : baseStyle.border,
      borderLeft: col === 0 ? '3px solid #333' : baseStyle.border,
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