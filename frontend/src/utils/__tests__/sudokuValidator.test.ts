import { validateSudokuBoard, getAllConflictingCells } from '../sudokuValidator';
import { SudokuBoard } from '../../types';

const createEmptyBoard = (): SudokuBoard => 
  Array(9).fill(null).map(() => Array(9).fill(null));

describe('sudokuValidator', () => {
  describe('validateSudokuBoard', () => {
    test('returns valid for empty board', () => {
      const board = createEmptyBoard();
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    test('returns valid for board with no conflicts', () => {
      const board = createEmptyBoard();
      board[0][0] = 1;
      board[0][1] = 2;
      board[1][0] = 3;
      board[1][1] = 4;
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(true);
      expect(result.conflicts).toHaveLength(0);
    });

    test('detects row conflicts', () => {
      const board = createEmptyBoard();
      board[0][0] = 1;
      board[0][5] = 1; // Same row, same number
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(false);
      expect(result.conflicts).toHaveLength(2); // Both cells are flagged
      expect(result.conflicts[0].type).toBe('row');
      expect(result.conflicts[1].type).toBe('row');
    });

    test('detects column conflicts', () => {
      const board = createEmptyBoard();
      board[0][0] = 5;
      board[3][0] = 5; // Same column, same number
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(false);
      expect(result.conflicts).toHaveLength(2);
      expect(result.conflicts[0].type).toBe('column');
      expect(result.conflicts[1].type).toBe('column');
    });

    test('detects 3x3 box conflicts', () => {
      const board = createEmptyBoard();
      board[0][0] = 7;
      board[1][1] = 7; // Same 3x3 box, same number
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(false);
      expect(result.conflicts).toHaveLength(2);
      expect(result.conflicts[0].type).toBe('box');
      expect(result.conflicts[1].type).toBe('box');
    });

    test('detects multiple types of conflicts for same cell', () => {
      const board = createEmptyBoard();
      board[0][0] = 9;
      board[0][1] = 9; // Row conflict
      board[1][0] = 9; // Column conflict
      board[1][1] = 9; // Box conflict
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(false);
      expect(result.conflicts.length).toBeGreaterThan(0);
      
      // Check that we have different types of conflicts
      const conflictTypes = result.conflicts.map(c => c.type);
      expect(conflictTypes).toContain('row');
      expect(conflictTypes).toContain('column');
      expect(conflictTypes).toContain('box');
    });

    test('handles complex board with multiple conflicts', () => {
      const board = createEmptyBoard();
      // Create multiple conflicts
      board[0][0] = 1;
      board[0][1] = 1; // Row conflict
      board[2][2] = 2;
      board[2][7] = 2; // Row conflict
      board[5][3] = 3;
      board[8][3] = 3; // Column conflict
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(false);
      expect(result.conflicts.length).toBeGreaterThan(0);
    });

    test('validates correct 3x3 box boundaries', () => {
      const board = createEmptyBoard();
      // Test different 3x3 boxes
      board[0][0] = 5; // Top-left box
      board[2][2] = 5; // Same top-left box - should conflict
      
      board[3][3] = 8; // Middle box
      board[5][5] = 8; // Same middle box - should conflict
      
      const result = validateSudokuBoard(board);
      
      expect(result.isValid).toBe(false);
      expect(result.conflicts.length).toBe(4); // All 4 cells should be flagged
    });
  });

  describe('getAllConflictingCells', () => {
    test('returns empty set for valid board', () => {
      const board = createEmptyBoard();
      const validation = validateSudokuBoard(board);
      const conflictingCells = getAllConflictingCells(validation);
      
      expect(conflictingCells.size).toBe(0);
    });

    test('returns correct cell keys for conflicting cells', () => {
      const board = createEmptyBoard();
      board[0][0] = 1;
      board[0][5] = 1; // Row conflict
      
      const validation = validateSudokuBoard(board);
      const conflictingCells = getAllConflictingCells(validation);
      
      expect(conflictingCells.size).toBe(2);
      expect(conflictingCells.has('0-0')).toBe(true);
      expect(conflictingCells.has('0-5')).toBe(true);
    });

    test('handles multiple conflicts correctly', () => {
      const board = createEmptyBoard();
      board[0][0] = 9;
      board[0][1] = 9; // Row conflict
      board[1][0] = 9; // Column conflict
      
      const validation = validateSudokuBoard(board);
      const conflictingCells = getAllConflictingCells(validation);
      
      expect(conflictingCells.size).toBe(3);
      expect(conflictingCells.has('0-0')).toBe(true);
      expect(conflictingCells.has('0-1')).toBe(true);
      expect(conflictingCells.has('1-0')).toBe(true);
    });

    test('includes all cells in conflict chain', () => {
      const board = createEmptyBoard();
      // Create a chain of conflicts
      board[1][1] = 4;
      board[1][2] = 4; // Row conflict with [1,1]
      board[2][1] = 4; // Column conflict with [1,1]
      
      const validation = validateSudokuBoard(board);
      const conflictingCells = getAllConflictingCells(validation);
      
      // All three cells should be marked as conflicting
      expect(conflictingCells.size).toBe(3);
      expect(conflictingCells.has('1-1')).toBe(true);
      expect(conflictingCells.has('1-2')).toBe(true);
      expect(conflictingCells.has('2-1')).toBe(true);
    });
  });
});