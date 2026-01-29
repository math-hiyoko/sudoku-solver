import React, { useState, useRef, useCallback, useEffect } from 'react'
import { SudokuBoard as SudokuBoardType } from '../types/sudoku'

interface SudokuBoardProps {
  board: SudokuBoardType
  title?: string
  isInput?: boolean
  onChange?: (row: number, col: number, value: number | null) => void
  invalidCells?: { row: number; column: number }[]
  originalBoard?: SudokuBoardType
  // モバイル用props
  isMobileMode?: boolean
  selectedCell?: { row: number; col: number } | null
  onCellSelect?: (row: number, col: number) => void
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({
  board,
  title,
  isInput = false,
  onChange,
  invalidCells = [],
  originalBoard,
  isMobileMode = false,
  selectedCell,
  onCellSelect
}) => {
  const SUDOKU_LEVEL = parseInt(process.env.GATSBY_SUDOKU_LEVEL || '3')
  const boardSize = SUDOKU_LEVEL * SUDOKU_LEVEL

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

      // モバイル用に大きめのサイズ範囲を設定
      const isNarrowScreen = screenWidth < 768
      const minCellSize = isNarrowScreen ? 36 : 32
      const maxCellSize = isNarrowScreen ? 52 : 44
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

    // DeleteまたはBackspaceキーでセルをクリア
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      if (onChange) {
        onChange(row, col, null)
      }
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
    const targetInput = inputRefs.current[newRow][newCol]
    if (targetInput) {
      targetInput.focus()
    }
  }, [isInput, boardSize, onChange])

  const getTdStyle = useCallback((row: number, col: number) => {
    const isInvalid = invalidCells.some(cell => cell.row === row && cell.column === col)

    // 各セルに上と左のボーダーを設定（均一な線の太さを保つため）
    // 最後の行に下ボーダー、最後の列に右ボーダーを追加
    const isBlockTopEdge = row % SUDOKU_LEVEL === 0
    const isBlockLeftEdge = col % SUDOKU_LEVEL === 0

    return {
      padding: 0,
      borderStyle: 'solid',
      borderColor: isInvalid ? '#ff4444' : '#333',
      borderTopWidth: isBlockTopEdge ? '2px' : '1px',
      borderLeftWidth: isBlockLeftEdge ? '2px' : '1px',
      borderRightWidth: col === boardSize - 1 ? '2px' : '0',
      borderBottomWidth: row === boardSize - 1 ? '2px' : '0',
    }
  }, [invalidCells, SUDOKU_LEVEL, boardSize])

  const getCellStyle = useCallback((row: number, col: number) => {
    const isInvalid = invalidCells.some(cell => cell.row === row && cell.column === col)
    const isNewValue = originalBoard && !isInput &&
      (originalBoard[row][col] === null || originalBoard[row][col] === undefined || isNaN(originalBoard[row][col])) &&
      board[row][col] !== null
    const isFocused = focusedCell && focusedCell.row === row && focusedCell.col === col
    const isSelected = selectedCell && selectedCell.row === row && selectedCell.col === col

    const getBackgroundColor = () => {
      if (isInvalid) return '#ffe6e6'
      if (isSelected && isMobileMode) return '#b3d9ff'  // モバイル選択時は濃い青
      if (isFocused && isInput) return '#e6f3ff'
      if (isInput) return '#fff'
      return '#f9f9f9'
    }

    // モバイル選択時のボックスシャドウ
    const boxShadow = (isSelected && isMobileMode) ? 'inset 0 0 0 3px #007bff' : 'none'

    return {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      fontSize: cellSize >= 40 ? '18px' : '16px',
      fontWeight: '700',
      backgroundColor: getBackgroundColor(),
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)',
      touchAction: 'manipulation',
      textAlign: 'center' as const,
      boxSizing: 'border-box' as const,
      padding: 0,
      border: 'none',
      boxShadow,
      color: isInvalid ? '#cc0000' : (isNewValue ? '#007bff' : '#333'),
      ...(isInput && !isMobileMode ? {
        WebkitAppearance: 'none' as const,
        MozAppearance: 'textfield' as const,
      } : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none' as const,
        cursor: isMobileMode && isInput ? 'pointer' : 'default',
      }),
    }
  }, [invalidCells, originalBoard, isInput, board, focusedCell, cellSize, selectedCell, isMobileMode])

  return (
    <div style={{ margin: '20px 0' }}>
      {title && <h3 style={{ marginBottom: '10px' }}>{title}</h3>}
      <table style={{ borderCollapse: 'collapse', display: 'inline-block' }}>
        <tbody>
          {board.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} style={getTdStyle(rowIndex, colIndex)}>
                  {isMobileMode && isInput ? (
                    // モバイルモード: タップ可能なdiv
                    <div
                      style={getCellStyle(rowIndex, colIndex)}
                      className="sudoku-cell"
                      onClick={() => onCellSelect?.(rowIndex, colIndex)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          onCellSelect?.(rowIndex, colIndex)
                        }
                      }}
                      aria-label={`セル ${rowIndex + 1}行 ${colIndex + 1}列${cell ? `, 値 ${cell}` : ', 空'}`}
                    >
                      {cell || ''}
                    </div>
                  ) : isInput ? (
                    // デスクトップモード: input要素
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
                    // 解答表示モード
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