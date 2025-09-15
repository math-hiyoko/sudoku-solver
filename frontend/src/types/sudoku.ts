export type SudokuCell = number | null;

export type SudokuBoard = SudokuCell[][];

export interface SudokuSolution {
  solution: SudokuBoard;
}

export interface SudokuApiResponse {
  solutions: SudokuSolution[];
  num_solutions: number;
  is_exact_num_solutions: boolean;
}

export interface SudokuApiRequest {
  board: SudokuBoard;
}