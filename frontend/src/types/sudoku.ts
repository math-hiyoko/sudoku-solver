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

export interface SudokuErrorDetail {
  row: number;
  column: number;
  number: number;
}

export interface SudokuApiError {
  type: 'InvalidInput' | 'OutOfRangeError' | 'ConstraintViolation' | 'InternalServerError';
  message: string;
  detail?: SudokuErrorDetail[];
}

export interface SudokuApiErrorResponse {
  error: SudokuApiError;
}