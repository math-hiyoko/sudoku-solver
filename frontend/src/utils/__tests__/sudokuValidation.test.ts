import {
  validateSudokuConstraints,
  validateNumberRange,
  validateBoardSize
} from '../sudokuValidation'
import { SudokuBoard } from '../../types/sudoku'

describe('sudokuValidation', () => {
  describe('validateBoardSize', () => {
    it('should validate correct 9x9 board size', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      expect(validateBoardSize(board)).toBe(true)
    })

    it('should validate correct 4x4 board size', () => {
      const board: SudokuBoard = Array(4).fill(null).map(() => Array(4).fill(null))
      expect(validateBoardSize(board)).toBe(true)
    })

    it('should reject incorrect board size', () => {
      const board: SudokuBoard = Array(8).fill(null).map(() => Array(8).fill(null))
      expect(validateBoardSize(board)).toBe(false)
    })

    it('should reject non-square board', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(8).fill(null))
      expect(validateBoardSize(board)).toBe(false)
    })
  })

  describe('validateNumberRange', () => {
    it('should validate numbers within range for 9x9 board', () => {
      expect(validateNumberRange(1, 9)).toBe(true)
      expect(validateNumberRange(5, 9)).toBe(true)
      expect(validateNumberRange(9, 9)).toBe(true)
    })

    it('should reject numbers outside range for 9x9 board', () => {
      expect(validateNumberRange(0, 9)).toBe(false)
      expect(validateNumberRange(10, 9)).toBe(false)
      expect(validateNumberRange(-1, 9)).toBe(false)
    })

    it('should validate numbers within range for 4x4 board', () => {
      expect(validateNumberRange(1, 4)).toBe(true)
      expect(validateNumberRange(4, 4)).toBe(true)
    })

    it('should reject numbers outside range for 4x4 board', () => {
      expect(validateNumberRange(5, 4)).toBe(false)
      expect(validateNumberRange(0, 4)).toBe(false)
    })
  })

  describe('validateSudokuConstraints', () => {
    it('should validate empty board as valid', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should validate partially filled valid board', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      board[0][0] = 1
      board[0][1] = 2
      board[1][0] = 3
      board[1][1] = 4

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect row constraint violation', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      board[0][0] = 1
      board[0][1] = 1 // Same number in same row

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2) // Both cells are reported as errors
      expect(result.errors).toContainEqual({ row: 0, column: 0, number: 1 })
      expect(result.errors).toContainEqual({ row: 0, column: 1, number: 1 })
    })

    it('should detect column constraint violation', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      board[0][0] = 1
      board[1][0] = 1 // Same number in same column

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2) // Both cells are reported as errors
      expect(result.errors).toContainEqual({ row: 0, column: 0, number: 1 })
      expect(result.errors).toContainEqual({ row: 1, column: 0, number: 1 })
    })

    it('should detect block constraint violation', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      board[0][0] = 1
      board[1][1] = 1 // Same number in same 3x3 block

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2) // Both cells are reported as errors
      expect(result.errors).toContainEqual({ row: 0, column: 0, number: 1 })
      expect(result.errors).toContainEqual({ row: 1, column: 1, number: 1 })
    })

    it('should detect multiple constraint violations', () => {
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      board[0][0] = 1
      board[0][1] = 1 // Row violation
      board[4][4] = 1
      board[4][8] = 1 // Another row violation

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(4) // All conflicting cells are reported
    })

    it('should work with 4x4 board', () => {
      const board: SudokuBoard = Array(4).fill(null).map(() => Array(4).fill(null))
      board[0][0] = 1
      board[0][1] = 1 // Row violation in 4x4 board

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(false)
      expect(result.errors).toHaveLength(2) // Both cells are reported as errors
      expect(result.errors).toContainEqual({ row: 0, column: 0, number: 1 })
      expect(result.errors).toContainEqual({ row: 0, column: 1, number: 1 })
    })

    it('should handle the exact case from curl example', () => {
      // This recreates the constraint violation from the curl example
      const board: SudokuBoard = Array(9).fill(null).map(() => Array(9).fill(null))
      board[4][8] = 1  // row 4, column 8
      board[7][8] = 1  // row 7, column 8 - same column violation
      board[8][0] = 1  // row 8, column 0
      board[8][7] = 1  // row 8, column 7
      board[8][8] = 1  // row 8, column 8 - multiple violations in row 8

      const result = validateSudokuConstraints(board)
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)

      // Should detect violations in row 8 and column 8
      const row8Errors = result.errors.filter(e => e.row === 8)
      const col8Errors = result.errors.filter(e => e.column === 8)

      expect(row8Errors.length).toBeGreaterThan(0)
      expect(col8Errors.length).toBeGreaterThan(0)
    })
  })
})