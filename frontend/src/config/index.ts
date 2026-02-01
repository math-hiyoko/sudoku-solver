import { SudokuBoard } from '../types/sudoku'

// Environment configuration
export const config = {
  sudokuLevel: parseInt(process.env.GATSBY_SUDOKU_LEVEL || '3'),
  maxNumSolutions: parseInt(process.env.GATSBY_SUDOKU_MAX_NUM_SOLUTIONS || '1000000'),
  maxDisplaySolutions: parseInt(process.env.GATSBY_SUDOKU_MAX_SOLUTIONS || '30'),
  apiUrl: process.env.GATSBY_API_URL!,
}

export const boardSize = config.sudokuLevel * config.sudokuLevel

// Sample puzzles
export const SAMPLE_PUZZLES: { key: string; board: SudokuBoard }[] = [
  {
    key: 'sample1',
    board: [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, 3, null, 8, 5],
      [null, null, 1, null, 2, null, null, null, null],
      [null, null, null, 5, null, 7, null, null, null],
      [null, null, 4, null, null, null, 1, null, null],
      [null, 9, null, null, null, null, null, null, null],
      [5, null, null, null, null, null, null, 7, 3],
      [null, null, 2, null, 1, null, null, null, null],
      [null, null, null, null, 4, null, null, null, 9],
    ],
  },
  {
    key: 'sample2',
    board: [
      [null, null, null, 2, null, null, 7, null, 1],
      [6, null, null, null, 7, null, null, 9, null],
      [null, 9, null, null, null, 4, null, null, null],
      [null, 2, null, 1, null, null, null, 4, null],
      [null, null, 4, null, null, 2, 9, null, null],
      [null, 5, null, null, null, null, null, null, 8],
      [null, null, null, 3, null, null, null, null, 4],
      [null, 4, null, null, 5, null, null, 3, null],
      [7, null, 3, null, null, 8, null, null, null],
    ],
  },
  {
    key: 'sample3',
    board: [
      [8, null, null, null, null, null, null, null, 3],
      [null, null, 3, 6, null, null, null, null, null],
      [null, 7, null, null, 9, null, 2, null, null],
      [null, 5, null, null, null, 7, null, null, null],
      [null, null, null, null, null, 5, 7, null, null],
      [null, null, null, 1, null, null, null, null, null],
      [null, null, 1, null, null, null, null, 6, 8],
      [null, null, null, null, null, null, null, 1, null],
      [null, 9, null, null, null, null, 4, null, null],
    ],
  },
]

// Create empty board
export const createEmptyBoard = (): SudokuBoard =>
  Array(boardSize).fill(null).map(() => Array(boardSize).fill(null))
