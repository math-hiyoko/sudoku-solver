import { SudokuBoard, SudokuErrorDetail } from '../types/sudoku'

export interface ValidationResult {
  isValid: boolean
  errors: SudokuErrorDetail[]
}

/**
 * 数独の制約違反を検証する
 * 同じ行・列・ブロックに重複する数字がないかチェック
 */
export function validateSudokuConstraints(board: SudokuBoard): ValidationResult {
  const errors: SudokuErrorDetail[] = []
  const boardSize = board.length
  const blockSize = Math.sqrt(boardSize)

  // 各セルについて制約違反をチェック
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const value = board[row][col]

      // 空のセルやNaNはスキップ
      if (value === null || isNaN(value)) continue

      // 同じ行での重複チェック
      if (hasRowDuplicate(board, row, col, value)) {
        errors.push({ row, column: col, number: value })
      }
      // 同じ列での重複チェック
      else if (hasColumnDuplicate(board, row, col, value)) {
        errors.push({ row, column: col, number: value })
      }
      // 同じブロックでの重複チェック
      else if (hasBlockDuplicate(board, row, col, value, blockSize)) {
        errors.push({ row, column: col, number: value })
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 同じ行に重複する数字があるかチェック
 */
function hasRowDuplicate(board: SudokuBoard, row: number, col: number, value: number): boolean {
  for (let c = 0; c < board[row].length; c++) {
    if (c !== col && board[row][c] === value) {
      return true
    }
  }
  return false
}

/**
 * 同じ列に重複する数字があるかチェック
 */
function hasColumnDuplicate(board: SudokuBoard, row: number, col: number, value: number): boolean {
  for (let r = 0; r < board.length; r++) {
    if (r !== row && board[r][col] === value) {
      return true
    }
  }
  return false
}

/**
 * 同じブロックに重複する数字があるかチェック
 */
function hasBlockDuplicate(board: SudokuBoard, row: number, col: number, value: number, blockSize: number): boolean {
  const blockStartRow = Math.floor(row / blockSize) * blockSize
  const blockStartCol = Math.floor(col / blockSize) * blockSize

  for (let r = blockStartRow; r < blockStartRow + blockSize; r++) {
    for (let c = blockStartCol; c < blockStartCol + blockSize; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return true
      }
    }
  }
  return false
}

/**
 * 数値が有効な範囲内かチェック
 */
export function validateNumberRange(value: number, boardSize: number): boolean {
  return value >= 1 && value <= boardSize
}

/**
 * 盤面のサイズが正しいかチェック
 */
export function validateBoardSize(board: SudokuBoard): boolean {
  const size = board.length
  const expectedSize = Math.pow(Math.floor(Math.sqrt(size)), 2)

  // 正方形の盤面かチェック
  if (size !== expectedSize) return false

  // 各行の長さが正しいかチェック
  return board.every(row => row.length === size)
}