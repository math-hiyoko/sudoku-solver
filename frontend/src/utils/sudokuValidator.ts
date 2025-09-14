import { SudokuBoard, SudokuCell } from '../types';

export interface ValidationResult {
  isValid: boolean;
  conflicts: Array<{
    row: number;
    col: number;
    type: 'row' | 'column' | 'box';
    conflictWith: Array<{ row: number; col: number }>;
  }>;
}

export const validateSudokuBoard = (board: SudokuBoard): ValidationResult => {
  const conflicts: ValidationResult['conflicts'] = [];

  // Check for conflicts in each cell
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = board[row][col];
      if (cell !== null) {
        const cellConflicts = findConflictsForCell(board, row, col);
        if (cellConflicts.length > 0) {
          conflicts.push(...cellConflicts);
        }
      }
    }
  }

  return {
    isValid: conflicts.length === 0,
    conflicts
  };
};

const findConflictsForCell = (
  board: SudokuBoard, 
  row: number, 
  col: number
): ValidationResult['conflicts'] => {
  const cell = board[row][col];
  if (cell === null) return [];

  const conflicts: ValidationResult['conflicts'] = [];

  // Check row conflicts
  const rowConflicts = checkRowConflicts(board, row, col, cell);
  if (rowConflicts.length > 0) {
    conflicts.push({
      row,
      col,
      type: 'row',
      conflictWith: rowConflicts
    });
  }

  // Check column conflicts
  const colConflicts = checkColumnConflicts(board, row, col, cell);
  if (colConflicts.length > 0) {
    conflicts.push({
      row,
      col,
      type: 'column',
      conflictWith: colConflicts
    });
  }

  // Check 3x3 box conflicts
  const boxConflicts = checkBoxConflicts(board, row, col, cell);
  if (boxConflicts.length > 0) {
    conflicts.push({
      row,
      col,
      type: 'box',
      conflictWith: boxConflicts
    });
  }

  return conflicts;
};

const checkRowConflicts = (
  board: SudokuBoard, 
  row: number, 
  col: number, 
  value: SudokuCell
): Array<{ row: number; col: number }> => {
  const conflicts = [];
  
  for (let c = 0; c < 9; c++) {
    if (c !== col && board[row][c] === value) {
      conflicts.push({ row, col: c });
    }
  }
  
  return conflicts;
};

const checkColumnConflicts = (
  board: SudokuBoard, 
  row: number, 
  col: number, 
  value: SudokuCell
): Array<{ row: number; col: number }> => {
  const conflicts = [];
  
  for (let r = 0; r < 9; r++) {
    if (r !== row && board[r][col] === value) {
      conflicts.push({ row: r, col });
    }
  }
  
  return conflicts;
};

const checkBoxConflicts = (
  board: SudokuBoard, 
  row: number, 
  col: number, 
  value: SudokuCell
): Array<{ row: number; col: number }> => {
  const conflicts = [];
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  
  for (let r = boxRow; r < boxRow + 3; r++) {
    for (let c = boxCol; c < boxCol + 3; c++) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        conflicts.push({ row: r, col: c });
      }
    }
  }
  
  return conflicts;
};

// Helper function to get all conflicting cells for highlighting
export const getAllConflictingCells = (validation: ValidationResult): Set<string> => {
  const conflictingCells = new Set<string>();
  
  validation.conflicts.forEach(conflict => {
    // Add the main conflicting cell
    conflictingCells.add(`${conflict.row}-${conflict.col}`);
    
    // Add all cells it conflicts with
    conflict.conflictWith.forEach(({ row, col }) => {
      conflictingCells.add(`${row}-${col}`);
    });
  });
  
  return conflictingCells;
};